import { Pet } from './../types/Pet'
import { apiEndpoint } from '../config'
import Axios from 'axios'

export async function getAvailablePets(idToken: string): Promise<Pet[]> {
  console.log('Fetching available pets')

  const response = await Axios.get(`${apiEndpoint}/pets/available`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Pets:', response.data)
  return response.data.items
}

export async function getMyPets(idToken: string): Promise<Pet[]> {
  console.log('Fetching my pets')

  const response = await Axios.get(`${apiEndpoint}/pets/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Pets:', response.data)
  return response.data.items
}

export async function createPet(
  idToken: string,
  name: string,
  description: string
): Promise<Pet> {
  const response = await Axios.post(
    `${apiEndpoint}/pets`,
    JSON.stringify({
      name,
      description
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function walkPet(
  idToken: string,
  petId: string,
  userId: string
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/pets/${petId}/${userId}/walk`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function availablePet(
  idToken: string,
  petId: string
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/pets/${petId}/available`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deletePet(idToken: string, petId: string): Promise<void> {
  await Axios.delete(`${apiEndpoint}/pets/${petId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  petId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/pets/${petId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
