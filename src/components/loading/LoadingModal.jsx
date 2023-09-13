import { Modal } from "react-bootstrap";
import Loading from "./Loading";

const LoadingModal = ({ show }) => {
    return (
        <Modal
            show={show}
            className="load-modal-wrapper"
        >
            <div className="modal-body">
                <Loading classes="text-white" />
            </div>
        </Modal>
    );
}

export default LoadingModal;
