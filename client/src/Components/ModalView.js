import React from "react";
import PropTypes from "prop-types";
import {Dialog, FlatButton} from "material-ui";

const propTypes = {
    modalContent: PropTypes.object.isRequired,
    openModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

const defaultProps = {
    modalContent: {},
};

const ModalView = ({modalContent, openModal, handleClose}) => {
    if (modalContent) {
        return (
            <Dialog
                title={modalContent.title}
                modal={false}
                open={openModal}
                onRequestClose={handleClose}
                actions={[
                    <FlatButton
                        label="Close"
                        primary={true}
                        onTouchTap={handleClose}
                    />
                ]}
                >
                <img src={modalContent.img} alt=""/>
                <p>{modalContent.description}</p>
            </Dialog>)
    }
    return null;
};

ModalView.propTypes = propTypes;
ModalView.defaultProps = defaultProps;

export default ModalView;
