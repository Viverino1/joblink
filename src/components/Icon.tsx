import Image from "next/image";
import favicon from "../app/icon.svg";

export default function Icon(props: { className?: string }) {
  return <Image src={favicon} alt="Joblink Logo" className={props.className} />;
}
