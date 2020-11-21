import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createPet, uploadFile } from '../api/pets-api'

enum UploadState {
  NoUpload,
  UploadingData
}

interface CreatePetProps {
  match: {
    params: {}
  }
  auth: Auth
}

interface CreatePetState {
  name: string
  description: string
  uploadState: UploadState
}

export class CreatePet extends React.PureComponent<
  CreatePetProps,
  CreatePetState
> {
  state: CreatePetState = {
    name: '',
    description: '',
    uploadState: UploadState.NoUpload
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      this.setUploadState(UploadState.UploadingData)
      await createPet(
        this.props.auth.getIdToken(),
        this.state.name,
        this.state.description
      )

      alert('Pet was created!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Create new pet</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="Pet's name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="Pet's description"
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.UploadingData && (
          <p>Uploading pet metadata</p>
        )}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Create
        </Button>
      </div>
    )
  }
}
