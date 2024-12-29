"use client";
import React, { FormEvent, useState } from "react";
import FormGroup from "../fromgroup";
import TextAreaGroup from "../textarea";
import Button from "../button";
import axios from "axios";
import { API_URL } from "@/constant";
import { toast } from "react-toastify";

const BlogComment = ({ blogId }: { blogId: number }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const data = { name: name, email, comment: message, blog_id: blogId, is_visible: true };

  const handleComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/blog/comments`, data);
      toast.success(response.data.message);
      setName("");
      setEmail("");
      setMessage("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.log("comment error" + error);
    }
  };
  return (
    <div>
      <form onSubmit={handleComment}>
        <div className="grid grid-cols-2 gap-4">
          <FormGroup
            title="Name"
            className="mb-2 "
            required
            onChange={(e) => setName(e.target.value)}
          />
          <FormGroup
            title="Email"
            type="email"
            className=" mb-2"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <TextAreaGroup
          title="Your Comment"
          required
          onChange={(e: any) => setMessage(e.target.value)}
        />

        <Button
          type="submit"
          className="px-3 py-1 font-gotham font-normal text-sm mt-2"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BlogComment;
