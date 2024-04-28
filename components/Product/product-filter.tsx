import React, { useEffect, useState } from "react";
import { BodyText } from "@/components/BodyText";
import { debounce } from "@/lib/utils/util";
import Link from "next/link";
import { GqlProductCategoriesParentNode2Interface } from "@/lib/types/gql/product/product-categories-parent.type";
import { useRouter } from "next/router";

type Props = {
  title: string;
  list: GqlProductCategoriesParentNode2Interface[];
  click: ({ slug }: any) => void;
  routerFilter?: boolean;
}

const Node = (
  { node, routerFilter, checked, onChange }: {
    node: GqlProductCategoriesParentNode2Interface["children"],
    routerFilter: boolean,
    checked: string,
    onChange: (slug: string) => void
  }
) => {
  const router = useRouter();
  const slug = router.asPath.replace("/","")
  return <>
    {
      !!node?.nodes?.length && node.nodes.map(subItem => (
        <div key={subItem.databaseId}>
          <BodyText
            className={`b-flex cursor-pointer ml-4 py-1.5 duration-300 hover:text-main ${slug === subItem.slug ? "text-main !font-bold" : "text-gray-500"}`}
            size="md">
            <Link className="w-full" href={`/${subItem.slug}`}>{subItem.name}</Link>
            {
              !routerFilter &&
              <input className="cursor-pointer" type="checkbox" checked={checked === slug}
                     onChange={() => onChange(subItem.slug)} />
            }
          </BodyText>
          {
            !!subItem?.children?.nodes?.length && subItem.children.nodes.map(item => {
              return <BodyText key={item.databaseId}
                               className={`b-flex cursor-pointer ml-6 py-1.5 duration-300 hover:text-main ${slug === item.slug ? "text-main !font-bold" : "text-gray-500"}`}
                               size="md">
                <Link className="w-full" href={`/${item.slug}`}>{item.name}</Link>
                {
                  !routerFilter &&
                  <input className="cursor-pointer" type="checkbox" checked={checked === subItem.slug}
                         onChange={() => onChange(subItem.slug)} />
                }
              </BodyText>;
            })
          }
        </div>
      ))
    }
  </>;
};

function ProductFilter(props: Props) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string>("");
  const [list, setList] = useState<GqlProductCategoriesParentNode2Interface[]>([]);
  const [activeId, setActiveId] = useState<number>(0);
  const router = useRouter();
  const handlerCheck = (slug: string, open?: boolean) => {
    setChecked(val => {
      let newValue = "";
      if (val !== slug) {
        newValue = slug;
      }
      props.click({ slug: newValue });
      return newValue;
    });

    open && setOpen(false);
  };

  useEffect(() => {
    const debounceResize = debounce(() => {
      setOpen(window.innerWidth > 768);
    }, 300);
    window.addEventListener("resize", debounceResize);
    debounceResize();

    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, []);

  useEffect(() => {
    if (!!props?.routerFilter && !!props.list.length) {
      const { slug } = router.query as { slug: string };
      setList(old => {
        let flag = false;
        for (let i = 0; i < props.list.length; i++) {
          const item = props.list[i];
          if (item.slug === slug) {
            flag = true;
            setActiveId(item.databaseId);
            break;
          }

          const children = item.children.nodes;
          for (let j = 0; j < children.length; j++) {
            const child = children[j];
            if (child.slug === slug) {
              flag = true;
              setActiveId(child.databaseId);
              break;
            }
          }
          if (flag) break;
        }
        return props.list;
      });
    } else {
      setList(props.list);
    }
  }, [props.list, props.routerFilter, router]);

  return <>
    <div className="flex flex-col border border-themeSecondary200 rounded-t-xl max-md:hidden">
      <div className="bg-themeSecondary100 w-full py-6 rounded-t-xl px-6 b-flex">
        <BodyText intent="bold" size="lg" className="text-themeSecondary800">{props.title}</BodyText>
        <i className={`${open ? "ri-subtract-line" : "ri-add-line"} ri-lg cursor-pointer`}
           onClick={() => setOpen(!open)}></i>
      </div>
      {
        open && <div className="p-6 w-full h-full select-none">
          {
            list.map((item, index) => <div key={index}>
              <BodyText
                className={`b-flex cursor-pointer py-1.5 duration-300 hover:text-main ${activeId === item.databaseId ? "text-main !font-bold" : ""}`}
                size="lg">
                <Link className="w-full" href={`/${item.slug}`}>{item.name}</Link>
                {
                  !props.routerFilter && <input className="cursor-pointer" type="checkbox" checked={checked === item.slug}
                                                onChange={() => handlerCheck(item.slug)} />
                }
              </BodyText>
              <Node node={item.children} routerFilter={!!props.routerFilter}
                        onChange={handlerCheck} checked={checked} />
            </div>)
          }
        </div>
      }
    </div>
    <div className="max-md:flex hidden">
      <div className="w-full group relative">
        <div className="p-2 border w-full rounded border-main b-flex" onClick={() => setOpen(!open)}>
                    <span
                      className="line-clamp-1">{props.title}{checked ? ` - ${props.list.find(item => item.slug === checked)?.name}` : ""}</span>
          <i className={`${open ? "ri-subtract-line" : "ri-add-line"} cursor-pointer ri-lg`}></i>
        </div>
        <div className="absolute left-0 top-full w-full bg-white z-[2]">
          {
            open && <div className="p-6 py-2 w-full select-none shadow-lg max-h-[300px] overflow-y-auto">
              {
                list.map((item, index) =>
                  <div key={index}>
                    <BodyText
                      className="b-flex cursor-pointer py-1.5 duration-300 hover:text-gray-400" size="lg">
                      <Link className="w-full" href={`/${item.slug}`}>{item.name}</Link>
                      <input className="cursor-pointer" type="checkbox" checked={checked === item.slug}
                             onChange={() => handlerCheck(item.slug, true)} />
                    </BodyText>
                    {
                      !!item.children?.nodes?.length && item.children.nodes.map(subItem => (
                        <BodyText key={subItem.databaseId}
                                  className="b-flex cursor-pointer ml-4 py-1.5 duration-300 text-gray-500  hover:text-main"
                                  size="md">
                          <Link className="w-full" href={`/${subItem.slug}`}>{subItem.name}</Link>
                          <input className="cursor-pointer" type="checkbox" checked={checked === subItem.slug}
                                 onChange={() => handlerCheck(subItem.slug)} />
                        </BodyText>
                      ))
                    }
                  </div>)
              }
            </div>
          }
        </div>
      </div>
    </div>
  </>;
}

export default React.memo(ProductFilter);
