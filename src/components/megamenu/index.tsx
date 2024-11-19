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
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [expandedSubCategories, setExpandedSubCategories] = useState<{ [key: string]: boolean }>({});

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

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const toggleSubCategory = (slug: string) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };


  useEffect(() => {
    if (mobileMenuOpen) {
      setIsAnimating(true);
    } else if (!mobileMenuOpen && isAnimating) {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [mobileMenuOpen, isAnimating]);

  const handleMenuClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    } else {
      setIsAnimating(true);
      setMobileMenuOpen(true);
    }
  };
  return (
    <section className={stickyClass}>
      {/* Desktop Menu */}
      <div className="py-2 shadow hidden md:block">
        <div className="container px-2 md:px-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {menus
                ?.filter(
                  (parent) =>
                    parent.parent_category === "0" ||
                    parent.parent_category === null ||
                    parent.parent_category === ""
                ).sort((a, b) => {
                  if (a.slug === "campaign") return 1;
                  if (b.slug === "campaign") return -1;
                  return (a.order_id || 0) - (b.order_id || 0);
                })
                .map((menu, index) => (
                  <div className="mr-2 text-left relative heading" key={index}>
                    <div
                      className="py-2 md:cursor-pointer  font-gotham font-medium text-[10px] md:text-sm flex justify-between items-center pr-5 group primary-text hover-text-color transition-all"
                      onClick={() => {
                        if (menu.slug === "campaign") {
                          route.push(`/campaign`);
                        } else {
                          route.push(`/category/filter?category=${menu.slug}`);
                          dispatch(addCategory({ title: menu.title, slug: menu.slug }));
                        }
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
                                className="font-gotham font-medium my-2 text-sm primary-text sub-element w-[90%]"
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
                                          className="font-gotham font-medium text-sm w-[90%] primary-text"
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
                className="font-gotham font-medium text-sm primary-text hover-text-color"
                href={"/videos"}
              >
                Videos
              </Link>
              <Link
                className="font-gotham font-medium text-sm primary-text hover-text-color ml-4 md:ml-14"
                href={"/blogs"}
              >
                Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="shadow py-[10px] md:hidden mobile-menu">
        <div className="container px-2">
          <div className="flex justify-between items-center">
            <div className="relative main-button">
              {/* Menu Icon */}
              <FaBars className="w-5 h-5" onClick={handleMenuClick} />
              {/* Conditionally show menu with sliding animation */}
              {(mobileMenuOpen || isAnimating) && (
                <div
                  className={`absolute white-bg mt-[11px] z-10 w-[180px] shadow -ml-[6px] pl-[6px] transition-transform duration-300 ease-in-out 
                ${mobileMenuOpen ? "slide-in" : "slide-out"}`} // Apply slide-in/out animation
                >
                  {menus
                    ?.filter(
                      (parent) =>
                        parent.parent_category === "0" ||
                        parent.parent_category === null ||
                        parent.parent_category === ""
                    )
                    .sort((a, b) => {
                      if (a.slug === "campaign") return 1;
                      if (b.slug === "campaign") return -1;
                      return (a.order_id || 0) - (b.order_id || 0);
                    })
                    .map((menu, index) => (
                      <div key={index} className="menus">
                        <div
                          className="py-2 cursor-pointer px-1 font-gotham font-medium text-sm flex justify-between items-center group primary-text hover-text-color transition-all parent-category"
                        >
                          <p
                            onClick={() => {
                              if (menu.slug === "campaign") {
                                route.push(`/campaign`);
                              } else {
                                route.push(`/category/filter?category=${menu.slug}`);
                                dispatch(addCategory({ title: menu.title, slug: menu.slug }));
                              }
                              handleMenuClick(); // Close menu on item click
                            }}
                          >
                            {(menu.title).toUpperCase()}
                          </p>
                          <span className="text-xl">
                            {menus.filter((category) => category.parent_category === menu.slug).length > 0 && (
                              <RiArrowDropDownLine onClick={() => toggleCategory(menu.slug)} className="text-xl" />
                            )}
                          </span>
                        </div>
                        {expandedCategories[menu.slug] && (
                          <div className="sub-categories">
                            {menus
                              .filter((category) => category.parent_category === menu.slug)
                              .sort((a, b) => (a.order_id || 0) - (b.order_id || 0))
                              .map((subCategory, index) => (
                                <div key={index} className="sub-category">
                                  <div
                                    className="relative sub-item cursor-pointer px-1 font-gotham font-medium text-sm flex justify-between items-center group primary-text hover-text-color transition-all"
                                  >
                                    <Link
                                      className="font-gotham font-sm my-2 text-sm primary-text hover-text-color sub-element"
                                      href={`/category/filter?category=${subCategory.slug}`}
                                      onClick={() => {
                                        dispatch(addCategory({ title: subCategory.title, slug: subCategory.slug }));
                                        handleMenuClick(); // Close menu when sub-category is clicked
                                      }}
                                    >
                                      {subCategory.title}
                                    </Link>
                                    {menus.filter((children) => children.parent_category === subCategory.slug).length > 0 && (
                                      <span>
                                        <RiArrowDropRightLine onClick={() => toggleSubCategory(subCategory.slug)} className="text-xl" />
                                      </span>
                                    )}
                                  </div>
                                  {expandedSubCategories[subCategory.slug] && (
                                    <div className="children-category">
                                      {menus
                                        .filter((children) => children.parent_category === subCategory.slug)
                                        .sort((a, b) => (a.order_id || 0) - (b.order_id || 0))
                                        .map((childrenCategory, index) => (
                                          <div
                                            key={index}
                                            className="sub-item cursor-pointer px-1 font-gotham font-medium text-sm flex justify-between items-center group primary-text hover-text-color transition-all"
                                            onClick={() => {
                                              dispatch(addCategory({ title: childrenCategory.title, slug: childrenCategory.slug }));
                                              handleMenuClick(); // Close menu when child category is clicked
                                            }}
                                          >
                                            <Link
                                              className="font-gotham font-sm my-2 text-sm primary-text hover-text-color sub-element"
                                              href={`/category/filter?category=${childrenCategory.slug}`}
                                            >
                                              {childrenCategory.title}
                                            </Link>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
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
                className="font-gotham font-medium text-sm primary-text hover-text-color"
                href={"/videos"}
                onClick={handleMenuClick} // Close menu when Videos is clicked
              >
                Videos
              </Link>
              <Link
                className="font-gotham font-medium text-sm primary-text hover-text-color ml-4 mr-2 md:mr-0 md:ml-14"
                href={"/blogs"}
                onClick={handleMenuClick} // Close menu when Blogs is clicked
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
