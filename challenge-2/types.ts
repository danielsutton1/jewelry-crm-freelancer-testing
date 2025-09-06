export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Communication {
  id: string
  message: string
  sender_id: string
  recipient_id: string
  created_at: string
  updated_at: string
}

export interface CommunicationWithUsers extends Communication {
  sender: Pick<User, 'name'> | null
  recipient: Pick<User, 'name'> | null
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export type CommunicationsResponse = ApiResponse<CommunicationWithUsers[]>
