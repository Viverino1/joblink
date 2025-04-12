import Image from "next/image";
import favicon from "../app/icon.svg";

export default function Icon(props: { className?: string }) {
  return <Image src={favicon} alt="Gateway Logo" className={props.className} />;
}
