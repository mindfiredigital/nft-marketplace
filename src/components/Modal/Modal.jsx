import React from "react";
import "./Modal.css";
import RingLoader from "react-spinners/RingLoader";

const Modal = ({ setIsOpen, heading, description, isButtonEnabled }) => {
  return (
    <>
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h3 className="heading">{heading}</h3>
          </div>
          <button className="closeBtn" onClick={() => setIsOpen(false)}>
            X
          </button>
          <hr />
          {!isButtonEnabled ?
            <div className="py-8 inline-block">
              <RingLoader
                color={"rgba(54, 215, 183, 1)"}
                loading={true}
                // cssOverride={override}
                size={40}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div> :
            <></>
          }

          <div className="modalContent">
            {description}
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              {
                isButtonEnabled ?
                  <button className="deleteBtn" onClick={() => setIsOpen(false)}>
                    <b>OK</b>
                  </button> :
                  <></>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;