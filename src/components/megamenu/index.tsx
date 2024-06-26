"use client";
import { ICategoryData } from "@/types/category";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa6";
import { RiArrowDropDownLine, RiArrowDropRightLine } from "react-icons/ri";
import "./index.scss";
import { useAppDispatch } from "@/redux/hooks";
import { addCategory } from "@/redux/features/category/categorySlice";
import { Suspense, useEffect, useState } from "react";
import SearchArea from "../search";

type IProps = {
  menus: ICategoryData[];
};

const MegaMenu = ({ menus }: IProps) => {
  const dispatch = useAppDispatch();
  const route = useRouter();
  const [stickyClass, setStickyClass] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function stickNavbar() {
    let windowHeight = window.scrollY;
    windowHeight >= 40 ? setStickyClass("sticky-navbar") : setStickyClass("");
  }

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);
    return () => {
      window.removeEventListener('scroll', stickNavbar);
    };
  }, []);

  return (
    <section className={stickyClass}>
      {/* Desktop Menu */}
      <div className="py-2 shadow hidden md:block">
        <div className="container px-2 md:px-0">
          <div className="flex justify-between items-center">
            <div className="flex">
              {menus
                ?.filter(
                  (parent) =>
                    parent.parent_category === "0" ||
                    parent.parent_category === null ||
                    parent.parent_category === ""
                )
                .map((menu, index) => (
                  <div className="mr-2 text-left relative heading" key={index}>
                    <div
                      className="py-2 md:cursor-pointer px-1 md:px-5 font-gotham font-medium text-[10px] md:text-sm flex justify-between items-center pr-5 group black-text hover-text-color transition-all"
                      onClick={() => {
                        route.push(`/category/filter?category=${menu.slug}`);
                        dispatch(
                          addCategory({ title: menu.title, slug: menu.slug })
                        );
                      }}
                    >
                      {menu.title.toUpperCase()}
                      <span className="text-xl md:block hidden">
                        {menus.filter(
                          (category) => category.parent_category === menu.slug
                        ).length > 1 && (
                            <RiArrowDropDownLine className="text-xl" />
                          )}
                      </span>
                    </div>
                    <div className="absolute z-10 sub-heading shadow">
                      {menus
                        .filter(
                          (category) => category.parent_category === menu.slug
                        )
                        .sort((a, b) => (a.order_id || 0) - (b.order_id || 0))
                        .map((subCategory, index) => (
                          <div key={index}>
                            <div className="relative flex justify-between items-center sub-item">
                              <Link
                                className="font-gotham font-medium my-2 text-sm black-text sub-element w-[90%]"
                                href={`/category/filter?category=${subCategory.slug}`}
                                onClick={() =>
                                  dispatch(
                                    addCategory({
                                      title: subCategory.title,
                                      slug: subCategory.slug,
                                    })
                                  )
                                }
                              >
                                {subCategory.title}
                              </Link>
                              {menus.filter(
                                (children) =>
                                  children.parent_category === subCategory.slug
                              ).length > 0 && (
                                  <span>
                                    <RiArrowDropRightLine className="text-xl" />
                                  </span>
                                )}
                              <div className="absolute children-item shadow">
                                <ul>
                                  {menus
                                    .filter(
                                      (children) =>
                                        children.parent_category ===
                                        subCategory.slug
                                    )
                                    .sort(
                                      (a, b) =>
                                        (a.order_id || 0) - (b.order_id || 0)
                                    )
                                    .map((childrenCategory, index) => (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          dispatch(
                                            addCategory({
                                              title: childrenCategory.title,
                                              slug: childrenCategory.slug,
                                            })
                                          )
                                        }
                                      >
                                        <Link
                                          className="font-gotham font-medium text-sm w-[90%] black-text"
                                          href={`/category/filter?category=${childrenCategory.slug}`}
                                        >
                                          {childrenCategory.title}
                                        </Link>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <Link
                className="font-gotham font-medium text-sm black-text hover-text-color"
                href={"/videos"}
              >
                Videos
              </Link>
              <Link
                className="font-gotham font-medium text-sm black-text hover-text-color ml-4 md:ml-14"
                href={"/blogs"}
              >
                Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="shadow py-2 md:hidden mobile-menu">
        <div className="container px-2">
          <div className="flex justify-between items-center">
            <div className="relative main-button">
              <FaBars onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
              {mobileMenuOpen && (
                <div className="absolute white-bg mt-4 z-10 w-[180px] shadow">
                  {menus
                    ?.filter(
                      (parent) =>
                        parent.parent_category === "0" ||
                        parent.parent_category === null ||
                        parent.parent_category === ""
                    )
                    .map((menu, index) => (
                      <div key={index} className="menus">
                        <div
                          className="py-2 cursor-pointer px-1 font-gotham font-medium text-sm flex justify-between items-center group black-text hover-text-color transition-all parent-category"
                          onClick={() => {
                            route.push(`/category/filter?category=${menu.slug}`);
                            dispatch(addCategory({ title: menu.title, slug: menu.slug }));
                          }}
                        >
                          <Link href={`/category/filter?category=${menu.slug}`}>{menu.title}</Link>
                          <span className="text-xl">
                            {menus.filter((category) => category.parent_category === menu.slug).length > 0 && (
                              <RiArrowDropDownLine className="text-xl" />
                            )}
                          </span>
                        </div>
                        <div className="sub-categories">
                          {menus
                            .filter((category) => category.parent_category === menu.slug)
                            .sort((a, b) => (a.order_id || 0) - (b.order_id || 0))
                            .map((subCategory, index) => (
                              <div key={index} className="sub-category">
                                <div className="relative sub-item cursor-pointer px-1 font-gotham font-medium text-sm flex justify-between items-center group  black-text hover-text-color  self  transition-all">
                                  <Link
                                    className="font-gotham font-sm my-2 text-sm black-text sub-element"
                                    href={`/category/filter?category=${subCategory.slug}`}
                                    onClick={() => dispatch(addCategory({ title: subCategory.title, slug: subCategory.slug }))}
                                  >
                                    {subCategory.title}
                                  </Link>
                                  {menus.filter((children) => children.parent_category === subCategory.slug).length > 0 && (
                                    <span>
                                      <RiArrowDropRightLine className="text-xl" />
                                    </span>
                                  )}
                                </div>
                                <div className="children-category">
                                  {menus
                                    .filter((children) => children.parent_category === subCategory.slug)
                                    .sort((a, b) => (a.order_id || 0) - (b.order_id || 0))
                                    .map((childrenCategory, index) => (
                                      <div
                                        key={index}
                                        className="sub-item cursor-pointer px-1 font-gotham font-medium text-sm flex justify-between items-center group black-text hover-text-color transition-all self"
                                        onClick={() => dispatch(addCategory({ title: childrenCategory.title, slug: childrenCategory.slug }))}
                                      >
                                        <Link
                                          className="font-gotham font-sm my-2 text-sm black-text sub-element"
                                          href={`/category/filter?category=${childrenCategory.slug}`}
                                        >
                                          {childrenCategory.title}
                                        </Link>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <Suspense>
              <SearchArea />
            </Suspense>

            <div>
              <Link
                className="font-gotham font-medium text-sm black-text hover-text-color"
                href={"/videos"}
              >
                Videos
              </Link>
              <Link
                className="font-gotham font-medium text-sm black-text hover-text-color ml-4 mr-2 md:mr-0 md:ml-14"
                href={"/blogs"}
              >
                Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MegaMenu;
