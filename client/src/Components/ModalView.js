import React from "react";
import PropTypes from "prop-types";
import {Dialog, FlatButton, ListItem, List} from "material-ui";
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

const propTypes = {
    modalContent: PropTypes.object.isRequired,
    openModal: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};

const defaultProps = {
    modalContent: {}
};

const ModalView = ({modalContent, openModal, handleClose, linkText}) => {
    const {contributors, link} = modalContent;
    if (modalContent) {
        return (
            <Dialog
                title={modalContent.title}
                modal={false}
                open={openModal}
                onRequestClose={handleClose}
                className="modalView"
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
                {contributors && contributors.length > 0 &&
                    <div>
                        <div> Мы пришлашаем всех к участию и развитию этого проекта, дизайнеры, тестировшики, бек и
                            фронт девелоперы
                            <a href="https://github.com/GlebDolzhikov/allEvents"> би велком! </a>
                        </div>
                        <List>
                            <Subheader>Разработчики</Subheader>
                            {contributors.map((user) =>
                            <a href={user.html_url}
                               key={user.id}
                                >
                                <ListItem
                                    primaryText={user.login}
                                    leftAvatar={<Avatar src={user.avatar_url} />}
                                    rightIcon={<CommunicationChatBubble/>}
                                    />
                            </a>
                            )}
                        </List>
                    </div>
                }
            </Dialog>)
    }
    return null;
};

ModalView.propTypes = propTypes;
ModalView.defaultProps = defaultProps;

export default ModalView;
