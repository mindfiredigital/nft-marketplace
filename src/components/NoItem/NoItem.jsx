import "./NoItem.css";
import image from "../../assets/k.jpg";
export default function NoItem(props) {
  return (
    <div>
      <div class="absolute inset-0 flex justify-center items-center">
        <img
          class="w-full h-[85%] object-cover"
          src={image}
          alt="No Item Image"
        />
      </div>
      <div class="absolute inset-0 flex justify-center items-center">
        <div class="text-center text-container">
          <h1 class="text-3xl font-medium text-black">{props.heading}</h1>
          <p class="mt-2 text-lg text-black-300">
            {props.content}
          </p>
        </div>
      </div>
    </div>
  );
}
