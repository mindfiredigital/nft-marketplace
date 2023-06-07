import "./NoItem.css";
import image from "../../assets/k.jpg";
export default function NoItem(props) {
  return (
    <div>
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          className="w-full h-[85%] object-cover"
          src={image}
          alt="No Item Image"
        />
      </div>
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="text-center text-container">
          <h1 className="text-3xl font-medium text-black">{props.heading}</h1>
          <p className="mt-2 text-lg text-black-300 text-black">
            {props.content}
          </p>
        </div>
      </div>
    </div>
  );
}
