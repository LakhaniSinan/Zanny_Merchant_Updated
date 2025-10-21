import React, { useState } from 'react';
import { width } from 'react-native-dimension';
import Modal from 'react-native-modal';

let data = {};

const CommonModal = React.forwardRef((props, ref) => {
  const [isVisible, ModalVisibility] = useState(false);

  React.useImperativeHandle(ref, () => ({
    isVisible(params) {
      console.log(params.height, 'asdsd');
      data = params;
      ModalVisibility(true);
    },
    hide() {
      ModalVisibility(false);
    },
  }));
  return (
    <Modal
      style={{
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutRight"
      backdropOpacity={0.5}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      onBackdropPress={() => {
        ModalVisibility(false);
        // propsData = {}
      }}>
      {props.children}
    </Modal>
  );
});

export default CommonModal;
