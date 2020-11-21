import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  GridColumn
} from 'semantic-ui-react'

import { deletePet, getMyPets, availablePet } from '../api/pets-api'
import Auth from '../auth/Auth'
import { Pet } from '../types/Pet'

interface MyPetsProps {
  auth: Auth
  history: History
}

interface MyPetsState {
  pets: Pet[]
  loadingPets: boolean
}

export class MyPets extends React.PureComponent<MyPetsProps, MyPetsState> {
  state: MyPetsState = {
    pets: [],
    loadingPets: true
  }

  onEditButtonClick = (petId: string) => {
    this.props.history.push(`/pets/${petId}/edit`)
  }

  onPetDelete = async (petId: string) => {
    try {
      await deletePet(this.props.auth.getIdToken(), petId)
      this.setState({
        pets: this.state.pets.filter((pet) => pet.petId != petId)
      })
    } catch {
      alert('Pet deletion failed')
    }
  }

  onAvailableButtonClick = async (petId: string, pos: number) => {
    try {
      const pet = this.state.pets[pos]
      await availablePet(this.props.auth.getIdToken(), petId)
      alert(`${pet.name} is available for fake walks again`)
      const pets = this.state.pets.map((pet) => {
        if (pet.petId === petId) {
          pet.available = 'true'
        }
        return pet
      })
      this.setState({
        pets
      })
    } catch {
      alert('Pet walk failed')
    }
  }

  onPetCreate = async () => {
    this.props.history.push(`/pets/create`)
  }

  async componentDidMount() {
    try {
      const pets = await getMyPets(this.props.auth.getIdToken())
      this.setState({
        pets,
        loadingPets: false
      })
    } catch (e) {
      alert(`Failed to fetch pets: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        {this.renderCreatePetInput()}

        {this.renderPets()}
      </div>
    )
  }

  renderCreatePetInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button color="teal" onClick={this.onPetCreate}>
            Add New Pet
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPets() {
    if (this.state.loadingPets) {
      return this.renderLoading()
    }

    return this.renderPetsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Pets
        </Loader>
      </Grid.Row>
    )
  }

  renderPetsList() {
    return (
      <Grid padded>
        {this.state.pets.map((pet, pos) => {
          return (
            <Grid.Row key={pet.petId}>
              <Grid.Column width={1}>{pet.name}</Grid.Column>
              <Grid.Column width={6} floated="right">
                {pet.description}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {pet.available === 'false' && (
                  <Button
                    icon
                    color="green"
                    onClick={() => this.onAvailableButtonClick(pet.petId, pos)}
                  >
                    Make Available
                  </Button>
                )}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(pet.petId)}
                >
                  <Icon name="photo" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPetDelete(pet.petId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <GridColumn width={4} floated="left">
                {pet.attachmentUrl && (
                  <Image src={pet.attachmentUrl} size="small" wrapped />
                )}
              </GridColumn>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
