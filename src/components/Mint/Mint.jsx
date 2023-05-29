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
        <div className="row">
          <div className="col-sm-12">
            <h1 className="text-left sc-heading">Create NFT</h1>
            <p className="text-left sc-heading">
              Most popular nft market place for celebrities
            </p>
          </div>
        </div>

        <form>
          <div class="row form-background">
            <div class="col-sm-12">
              <label className="uploadFile">
                <span className="filename">Choose NFT Image</span>
                <input
                  type="file"
                  className="inputfile form-control"
                  name="file"
                />
                <span className="icon">
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </span>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 form-background input-group">
              <input
                type="text"
                className="form-control item-1"
                placeholder="NFT Name"
              />
              <input
                type="text"
                className="form-control item-2"
                placeholder="NFT Quantities"
              />
            </div>
            <div class="col input-group">
              <input
                type="text"
                className="form-control item-1"
                placeholder="Confidence"
              />
              <input
                type="text"
                className="form-control item-2"
                placeholder="Energy Level"
              />
            </div>
            <div class="col input-group">
              <input
                type="text"
                className="form-control item-1"
                placeholder="Personality"
              />
              <input
                type="text"
                className="form-control item-2"
                placeholder="Behavior"
              />
            </div>
            <div class="col input-group">
              <input
                type="text"
                className="form-control item-1"
                placeholder="Intelligence"
              />
              <input
                type="text"
                className="form-control item-2"
                placeholder="Popularity"
              />
            </div>

            <div class="col "></div>
            <textarea
              class="form-control col-12 row-3 input-group text"
              placeholder="NFT Description"
            ></textarea>
          </div>
          <div class="row">
            <div class="col-sm-12">
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
            </div>
          </div>
        </form>
        
      </div>
    </div>
    </div>
    
  );
}

export default Mint;
