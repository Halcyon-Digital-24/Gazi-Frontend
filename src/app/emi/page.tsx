import { API_URL } from "@/constant";
import "./page.scss";
import ServerPagination from "@/components/pagination/pagination";
import SearchEmi from "@/components/searchEmi";
import { Suspense } from "react";

async function getEmis(page: number, limit: number, search: string) {
  const res = await fetch(
    `${API_URL}/emis?page=${page}&limit=${limit}&bank_name=${search}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  /*  if (!res.ok) {
    throw new Error('Failed to fetch data');
  } */

  return res.json();
}

async function Emi({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === "string" ? Number(searchParams.limit) : 12;
  const search =
    typeof searchParams.bank_name === "string" ? searchParams.bank_name : "";

  const emisData: IEmiResponse = await getEmis(page, limit, search);

  return (
    <section className="emi">
      <div className="container">
        <h2 className=" font-gotham text-base mb-2 font-medium primary-text ml-1 md:ml-0">
          Emi Bank List
        </h2>
      </div>
      <div className="container md:overflow-x-auto overflow-x-scroll emi-table">
        <Suspense>
        <SearchEmi />
        </Suspense>
        <table className="w-full text-sm text-left emi-table shadow">
          <thead>
            <tr className="table-heading">
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                Bank Name
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                3 Month
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                6 Month
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                9 Month
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                12 Month
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                18 Month
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                24 Month
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                30 Month
              </th>
              <th
                scope="col"
                className="md:px-6 md:py-3 px-2 py-1 font-gotham font-medium border-color primary-text"
              >
                36 Month
              </th>
            </tr>
          </thead>
          <tbody>
            {emisData.data && emisData.data.rows ? (
              <>
                {emisData?.data.rows.map((emi, index) => (
                  <tr className="table-border" key={index}>
                    <td
                      scope="row "
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.bank_name}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.three_months ? "Yes" : "No"}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.six_months ? "Yes" : "No"}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.nine_months ? "Yes" : "No"}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.twelve_months ? "Yes" : "No"}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.eighteen_months ? "Yes" : "No"}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.twenty_four_months ? "Yes" : "No"}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.thirty_months ? "Yes" : "No"}
                    </td>
                    <td
                      scope="row"
                      className="md:px-6 md:py-3 px-2 py-1 font-gotham font-light border-color"
                    >
                      {emi.thirty_six_months ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={9}>
                  <p className="py-5 text-center font-gotham text-sm">
                    Bank is not available
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="container">
        <ServerPagination
          showTitle={`Show ${limit}`}
          page={page}
          totalPage={Math.ceil((emisData.data?.count || 1) / limit)}
        />
      </div>
    </section>
  );
}

export default Emi;
