import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './style.css'
import ActionButton from '../ActionButton'

import {
  fetchAccountDetails,
  setCurrentAccount,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
} from '../../../common/account/actions'

import {
  getStellarAssetsForDisplay
} from '../../../common/account/selectors'

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
}
from 'reactstrap'

class RemoveAsset extends Component {

  constructor (props) {
    super()
    this.state = {
      showModal: props.showModal,
      processing: false
    }

    this.toggleModal = this.toggleModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render () {
    const btnTitle = {
      default: 'Remove Asset',
      processing: 'Removing asset...'
    }

    const { currentAsset } = this.props

    return (
      <Modal isOpen={this.props.showModal} className={this.props.className} centered={true}>
        <ModalHeader style={{boxShadow: 'none'}} toggle={this.toggleModal}>Remove Asset</ModalHeader>
        <ModalBody>
          {`Are you sure you want to remove ${currentAsset.asset_name} (${currentAsset.asset_code}) ?`}
        </ModalBody>
        <ModalFooter>
          <ActionButton
            processing={ this.state.processing }
            title={ btnTitle }
            isForm={ false }
            actionClicked={ this.handleSubmit }
          />
        </ModalFooter>
      </Modal>
    )
  }

  toggleModal() {
    this.props.toggle(!this.props.showModal)
  }

  handleSubmit () {
    const updatedCurrentAsset = this.props.assets[0]
    this.setState({
      processing: true
    })
    this.timer = setTimeout( async () => {
      await this.changeTrust(this.props.currentAsset)
      await this.props.setCurrentAccount(updatedCurrentAsset)
      this.setState({
        processing: false
      })
    }, 1500)
  }

  async changeTrust (asset) {
    await this.props.changeTrustOperation(asset, true)
    await this.props.fetchAccountDetails()
    await this.props.fetchStellarAssetsForDisplay()
    await this.props.fetchBlockEQTokensForDisplay()
    await this.setState({ changeTrustInProcess: false })
    this.props.removeAssetSuccessful()
  }

}

const mapStateToProps = (state) => {
  return {
    assets: getStellarAssetsForDisplay(state)
  }
}

export default connect(mapStateToProps, {
  fetchAccountDetails,
  setCurrentAccount,
  fetchStellarAssetsForDisplay,
  fetchBlockEQTokensForDisplay,
  changeTrustOperation
})(RemoveAsset)