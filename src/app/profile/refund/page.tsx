'use client';
import { formatDate } from '@/components/dateformate';
import ProfileSidebar from '@/components/profile-sidebar';
import { useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa6';
import axiosInstance from '../../../../utils/axiosInstance';
import '../page.scss';
import '../order/page.scss';
import ProfilePagination from '@/components/profile-pagination';

const Refund = () => {
  const { login } = useAppSelector((state) => state.login);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const decrementPage = () => setPage(page > 1 ? page - 1 : 1);
  const incrementPage = () => setPage(page + 1);

  useEffect(() => {
    if (login?.accessToken) {
      const getAllOrders = async () => {
        try {
          const response = await axiosInstance.get(
            `customers/refunds?page=${page}&limit=10`,
            {
              headers: {
                Authorization: `Bearer ${login?.accessToken}`,
              },
            }
          );
          if (response.status == 200) {
            setTotal(response?.data?.data?.length);
            setRefunds(response?.data?.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getAllOrders();
    }
  }, [login, page]);
  return (
    <section className="profile">
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          <div className="sidebar  md:col-span-3  px-1">
            <span className="md:hidden">
              <FaBars />
            </span>
            <div className="items">
              <ProfileSidebar />
            </div>
          </div>
          <div className=" md:col-span-9 col-span-12 overflow-x-scroll md:overflow-x-visible  ">
            <div className="order-table">
              <table className="w-full text-sm text-left ">
                <thead>
                  <tr className="table-heading">
                    <th
                      scope="col"
                      className="px-6 py-3 font-gotham font-medium"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 font-gotham font-medium"
                    >
                      Order ID
                    </th>
                    <th className="px-6 py-3 font-gotham font-medium">
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 font-gotham font-medium"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 font-gotham font-medium"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {refunds?.map((item, index) => (
                    <tr
                      key={index}
                      className=" font-normal font-gotham text-sm table-border p-2"
                    >
                      <td className="px-6 py-4">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4">{item.order_id}</td>
                      <td className="px-6 py-4">{item.product_name}</td>
                      <td className="px-6 py-4">৳ {item.product_price}</td>
                      <td className="px-6 py-4">{item.refund_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 10 && (
              <div className="mt-5">
                <ProfilePagination
                  incrementPage={incrementPage}
                  decrementPage={decrementPage}
                  currentPage={page}
                  totalPage={Math.ceil(total / 10)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Refund;
