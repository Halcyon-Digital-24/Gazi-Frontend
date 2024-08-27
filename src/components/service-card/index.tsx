import Image from 'next/image';
import './index.scss';
import Link from 'next/link';
import { API_ROOT } from '@/constant';
import { IService } from '@/types/service';

interface IProps {
  service: IService;
}
const ServiceCard: React.FC<IProps> = ({ service }) => {
  return (
    <div className="text-center py-2">
      <Link href={service.url}>
        <div>
          <div
            className={`md:p-2 service-card flex justify-center flex-wrap items-center md:my-[30px]`}
          >
            <div className="image">
              <Image
                className="mr-2.5 w-[30px] md:w-[35px] h-[30px] md:h-[30px]"
                src={`${API_ROOT}/images/key-point/${service.image}`}
                width={35}
                height={35}
                alt="service"
              />
            </div>
            <div className="text">
              <h4 className=" font-gotham font-medium text-[14px] md:text-xl">
                {service.title}
              </h4>
              <h6 className=" font-gotham font-medium text-[10px] md:text-base">
                {service.subtitle}
              </h6>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard;
