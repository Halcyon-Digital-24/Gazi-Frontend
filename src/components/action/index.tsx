import { FC, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import './index.scss';

interface IProps {
  title: string;
  children: React.ReactNode;
}

const ActionButton: FC<IProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative action-area">
      <div
        className="flex justify-between items-center font-gotham font-normal text-xs cursor-pointer"
        onClick={toggleDropdown}
      >
        <span>{title}</span>
        <span className="ml-1">
          <IoMdArrowDropdown />
        </span>
      </div>
      {isOpen && (
        <div className="action-wrapper absolute shadow" onClick={closeDropdown}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ActionButton;
