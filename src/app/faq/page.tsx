"use client";
import QuestionAndAnswer from "@/components/question-ans";
import { API_URL } from "@/constant";
import { IFaq } from "@/types/faq";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import "./page.scss";
import CircleLoader from "@/components/css-loader";

const Faq = () => {
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState(1);

  const increment = () => {
    if (page >= 1) {
      setPage(page + 1);
    }
  };
  const decrement = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleQuestionToggle = (clickedIndex: number) => {
    const updatedSideLinks = faqs.map((linkItem, index) => ({
      ...linkItem,
      isOpen: index === clickedIndex ? !linkItem.isOpen : false,
    }));

    setFaqs(updatedSideLinks);
  };

  useEffect(() => {
    async function getEmis() {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/faqs?page=${page}`);
        setTotalPage(res.data?.data?.count / 10);
        setFaqs(res.data?.data?.rows);
        setLoading(false);
      } catch (error) {
        setFaqs([]);
        setLoading(false);
      }
    }

    getEmis();
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) {
    return <CircleLoader />;
  }

  return (
    <section className="faq py-5 md:py-10 px-2 md:px-0">
      <div className="container">
        <h2 className=" font-gotham font-medium text-base black-text">
          Questions
        </h2>
        {faqs.length <= 0 && (
          <p className=" font-gotham text-sm mt-2">Faq is Empty</p>
        )}

        <div className="grid grid-cols-1 gap-2 md:gap-4 mt-3 md:mt-9">
          {faqs.map((faq, index) => (
            <QuestionAndAnswer
              key={index}
              faq={faq}
              onToggle={() => handleQuestionToggle(index)}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <button
            onClick={decrement}
            disabled={page <= 1}
            className={`${page <= 1 ? "disable" : ""}`}
          >
            <FaLongArrowAltLeft className="icon" />
          </button>
          <button
            className={`${totalPage > page ? "" : "disable"}`}
            onClick={totalPage > page ? increment : () => {}}
            disabled={totalPage <= page}
          >
            <FaLongArrowAltRight className="icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Faq;
