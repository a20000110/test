import {
  ApolloClient,
  ApolloLink,
  ApolloQueryResult,
  createHttpLink,
  DocumentNode,
  InMemoryCache,
  NextLink,
  NormalizedCacheObject,
  Operation
} from "@apollo/client";

/**
 *中间件操作
 *如果我们在localStorage中有一个会话令牌，请将其作为会话头添加到GraphQL请求中。
 */
export const middleware = new ApolloLink((operation: Operation, forward: NextLink) => {
  const session = (process.browser) ? localStorage.getItem("woo-session") : null;
  if (session) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        "woocommerce-session": `Session ${session}`
      }
    }));
  }
  return forward(operation);

});

/**
 * 后置操作
 *
 * 这将捕获传入的会话令牌并将其存储在localStorage中，以备将来的GraphQL请求使用。
 */
export const afterware = new ApolloLink((operation, forward) => {

  return forward(operation).map(response => {

    if (!process.browser) {
      return response;
    }

    /**
     * 检查会话头并相应地更新本地存储中的会话。
     */
    const context = operation.getContext();
    const { response: { headers } } = context;
    const session = headers.get("woocommerce-session");

    if (session) {

      // 如果会话已销毁，删除会话数据。
      if ("false" === session) {

        localStorage.removeItem("woo-session");

        // 如果更改，则更新会话新数据。
      } else if (localStorage.getItem("woo-session") !== session) {
        localStorage.setItem("woo-session", headers.get("woocommerce-session"));

      }
    }

    return response;

  });
});

// Apollo GraphQL客户端。
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: middleware.concat(afterware.concat(createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
    // uri: `${process.env.NEXT_PUBLIC_API_TRANSLATE_URL}/api/graphql`,
    // uri: `http://localhost:3801/api/graphql`,
    fetch: fetch,
  }))),
  cache: new InMemoryCache({
    resultCaching:true,
  })
});

// 创建一个请求管理器
class RequestManager {
  private requestIds: {
    [key: string]: any
  } = {};

  query<T extends any>(params: {
    query: DocumentNode,
    variables?: Record<string, any>,
    requestId?: string
  }): Promise<ApolloQueryResult<T>> {
    return new Promise((resolve, reject) => {
      // 创建请求ID
      const controller: AbortController = new AbortController();
      const id = params.requestId;
      const query = client.watchQuery({
        query: params.query,
        variables: params.variables,
        context: {
          signal: controller.signal
        },
        fetchPolicy: "network-only"
      });
      const observable = query.subscribe((response: ApolloQueryResult<T>) => {
        // 处理响应
        id && delete this.requestIds[id]; // 完成请求删除控制器
        resolve(response);
      }, (error: any) => {
        id && delete this.requestIds[id]; // 请求错误后删除控制器
        reject(error);
      });
      id && (this.requestIds[id] = observable);
    });
  }

  // 根据请求ID中止请求
  abortRequest(id: string): boolean {
    if (this.requestIds.hasOwnProperty(id)) {
      const controller = this.requestIds[id];
      controller.unsubscribe();
      delete this.requestIds[id];
      return true;
    }
    return false;
  }
}


export default new RequestManager();
