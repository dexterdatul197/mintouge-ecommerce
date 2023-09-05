import { Modal } from "react-bootstrap";

const LoadingModal = ({ title, message, show, onHide, hasClose }) => {

    const onCloseModal = () => {
        onHide && onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onCloseModal}
            className="d-flex align-items-center justify-content-center"
            style={{ height: "100vh" }}
        >
            {title &&
                <Modal.Header className="cart-page-title" closeButton={hasClose}>
                    <h3>{title}</h3>
                </Modal.Header>
            }

            <div className="modal-body">
                <h4>{message}</h4>
            </div>
        </Modal>
    );
}

export default LoadingModal;
