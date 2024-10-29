import Link from "next/link";
import "./index.scss";

interface IProps {
  title: string;
  href?: string;
}
const Title: React.FC<IProps> = ({ title, href }) => {
  return (
    <div className="flex justify-between items-center category-title mb-4">
      <h1 className=" font-gotham font-medium text-lg primary-text mb-[10px] capital transition-all hover-text-color">
        {title}
      </h1>
      {href && (
        <Link
          className="font-gotham font-medium text-xs view primary-text border primary-border-color  py-1 px-2 mb-[10px] capital"
          href={href}
        >
          View All
        </Link>
      )}
    </div>
  );
};

export default Title;
