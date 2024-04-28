import { defaultLocale, handlerInnerHtml, isHtml } from "@/lib/utils/util";

type GetTValueResult = {
  index: {
    [key: string]: number[]
  },
  value: string[]
}

const _ = {
  get: (obj: any, path: any, defaultValue?: any) => {
    const pathArray = Array.isArray(path) ? path : path.split(".");
    let result = obj;

    for (let key of pathArray) {
      result = result[key];
      if (result === undefined) {
        return defaultValue;
      }
    }

    return result;
  },

// 类似 _.set 的函数
  set: (obj: any, path: any, value: any) => {

    const pathArray = Array.isArray(path) ? path : path.split(".");
    let current = obj;

    for (let i = 0; i < pathArray.length; i++) {
      if (i === pathArray.length - 1) {
        current[pathArray[i]] = value;
      } else {
        current[pathArray[i]] = current[pathArray[i]] || {};
        current = current[pathArray[i]];
      }
    }
    return obj;
  }
};

type ApplyValue = {
  value: string;
  index: number;
  isApply: boolean;
}

class SetTranValue {

  initData: any[] = [];

  private applyValue: ApplyValue[];

  constructor(applyValue: ApplyValue[]) {
    this.applyValue = applyValue;
  }

  static getNestedValue = (obj: any, path: any): any => {
    if (path.length === 0) {
      return [obj];
    }

    const [first, ...rest] = path;

    if (first === "[]") {
      if (!Array.isArray(obj)) {
        return [];
      }

      return obj.flatMap(item => this.getNestedValue(item, rest));
    }

    const nextObj = _.get(obj, first);

    if (nextObj === undefined) {
      return [];
    }

    return this.getNestedValue(nextObj, rest);
  };
  static getTValue = (data: any[], keys: string[]): GetTValueResult => {
    const getIndex = () => {
      let index = 0;
      const indexes = keys.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
      keys.forEach(key => {
        const path = key.replace(/\[\]/g, ".[]").split(".").filter(Boolean);
        data.forEach(item => {
          const values = this.getNestedValue(item, path);
          values.forEach(() => {
            // @ts-ignore
            indexes[key].push(index);
            index++;
          });
        });
      });

      return indexes;
    };
    const getValue = () => {
      return keys.flatMap(key => {
        const path = key.replace(/\[\]/g, ".[]").split(".").filter(Boolean);
        return data.flatMap(item => this.getNestedValue(item, path));
      });
    };
    return {
      index: getIndex(),
      value: getValue()
    };
  };

  setNestedValue = (obj: any[], path: any[], value: any, index = 0) => {
    const [first, ...rest] = path;
    const notApplyValue = this.applyValue.filter(item => !item.isApply);
    if (!notApplyValue.length) return;
    // 找到了最后一个数据
    if (path.length === 1) {
      if (path[0] === "[]" && Array.isArray(obj)) {
        const arrValue = notApplyValue?.slice(0, obj.length);
        this.applyValue = this.applyValue.map((aItem, aIndex) => {
          if (arrValue.map(a => a.index).includes(aIndex) && !aItem.isApply) {
            aItem.isApply = true;
          }
          return aItem;
        });
        obj.splice(0, obj.length, ...arrValue.map(a => a.value));
      } else {
        this.applyValue = this.applyValue.map((item, index) => {
          if (index === notApplyValue[0].index) {
            item.isApply = true;
          }
          return item;
        });
        return _.set(obj, path[0], notApplyValue[0].value);
      }
    } else {
      if (first === "[]") {
        if (Array.isArray(obj)) {
          obj.forEach((item, i2) => {
            this.setNestedValue(item, rest, value, i2);
          });
        }
      } else {
        const newObj = _.get(obj, first);
        if (newObj !== undefined) {
          this.setNestedValue(newObj, rest, value, index);
        }
      }
    }
  };

  setTValue = (data: any[], objKV: any) => {
    this.initData = JSON.parse(JSON.stringify(data));
    Object.entries(objKV).forEach(([key, value]) => {
      const path = key.replace(/\[\]/g, ".[]").split(".").filter(Boolean);
      this.initData.forEach((item, i) => {
        this.setNestedValue(item, path, value, i);
      });
    });
    return this.initData;
  };
}

export interface TranslatePageDataResponse {
  code: number;
  msg: string;
  data: string[];
}


// 翻译页面数据
export const translatePageData = async ({
                                          text,
                                          source = "en",
                                          translate
                                        }: {
  text: string[],
  source?: string;
  translate: string
}): Promise<string[]> => {
  try {
    const params = {
      text,
      source_language: source,
      translate_language: translate
    };
    // const url = cApiUrl + "/api/translate";
    const url = process.env.NEXT_PUBLIC_API_TRANSLATE_URL + "/api/translate";
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(params),
      cache: "force-cache",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()) as TranslatePageDataResponse;
    if (res.code === 200) {
      return res.data;
    } else {
      return [];
    }
  } catch (e) {
    return text;
  }
};


export const translateStaticProps = async (data: any[], keys: any[], source: string, translate: string | undefined): Promise<any[]> => {
  translate = translate || defaultLocale;
  if (translate === defaultLocale) return data;
  const { index, value } = SetTranValue.getTValue(data, keys);
  const text: any = {};
  Object.entries(index).forEach(([key, indexes]) => {
    indexes.forEach(index => {
      text[index] = value[index];
    });
  });
  if (!value.length) return [];
  let res = await translatePageData({
    text: value,
    source: "auto",
    translate
  });
  res = res.map((item) => {
    if (isHtml(item)) {
      item = handlerInnerHtml(item);
    }
    return item;
  });
  const kv = () => {
    const obj: any = {};
    Object.keys(index).map(item => {
      // @ts-ignore
      obj[item] = index[item].map(i => res[i]);
    });
    return obj;
  };
  if (res.length) {
    const newValue = (Object.entries(kv()).map(([key, value]) => {
      return value;
    })).flat();
    const applyValue = newValue.map((item, index) => {
      return {
        value: item,
        index,
        isApply: false
      };
    }) as ApplyValue[];

    const setTranValue = new SetTranValue(applyValue);
    return setTranValue.setTValue(data, kv());
  }
  return [];
};
