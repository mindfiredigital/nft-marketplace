import React from "react";
import "./Modal.css";
import RingLoader from "react-spinners/RingLoader";

const Modal = ({ setIsModalOpen, heading, description, isButtonEnabled }) => {
  return (
    <>
      <div className="darkBG" onClick={() => setIsModalOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h3 className="heading">{heading}</h3>
          </div>
          <button className="closeBtn" onClick={() => setIsModalOpen(false)}>
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
            <p>{description}</p>
          </div>
          <div className="modalActions">
            <div className="actionsContainer">
              {
                isButtonEnabled ?
                  <button className="deleteBtn" onClick={() => setIsModalOpen(false)}>
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