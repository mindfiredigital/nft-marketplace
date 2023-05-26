import background from "../../assets/background.jpg";
import "./Mint.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

function Mint() {
  return (
    <div className="create-item-container">
      <div className="form-create-item-content">
        <div className="form-create-item">
          <div className="sc-heading">
            <h3>Create NFT</h3>
            <p className="desc">Most popular nft market place for celebrities</p>
          </div>
          <form id="create-item-1">
            <label className="uploadFile">
              <span className="filename">Choose NFT image</span>
              <input type="file" className="inputfile form-control" name="file" />
              <span className="icon">
                <FontAwesomeIcon icon={faCloudArrowUp} />
              </span>
            </label>

            <div className="input-group">
              <input
                placeholder="NFT Name"
                className="item-1"
                name="name"
                type="text"
              />
              <input
                name="name"
                className="item-2"
                type="text"
                placeholder="NFT Quantities"
                required=""
              ></input>
            </div>
            <div className="input-group">
              <input
                placeholder="Confidence"
                className="item-1"
                name="name"
                type="text"
              />
              <input
                name="name"
                className="item-2"
                type="text"
                placeholder="Energy level"
                required=""
              ></input>
            </div>
            <div className="input-group">
              <input
                placeholder="Personality"
                className="item-1"
                name="name"
                type="text"
              />
              <input
                name="name"
                className="item-2"
                type="text"
                placeholder="Behavior"
                required=""
              ></input>
            </div>
            <div className="input-group">
              <input
                placeholder="Intelligence"
                className="item-1"
                name="name"
                type="text"
              />
              <input
                name="name"
                className="item-2"
                type="text"
                placeholder="Popularity"
                required=""
              ></input>
            </div>

            <textarea
              id="comment-message"
              name="message"
              tabindex="4"
              placeholder="NFT Description"
              aria-required="true"
            ></textarea>

            <button
              name="submit"
              type="submit"
              id="submit"
              className="sc-button"
            >
              <span>
                <FontAwesomeIcon icon={faPaperPlane} />
              </span>
              Mint NFT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Mint;