import { TeamMemberCardProps } from '@/widgets/TeamMemberCard'
const BASE_URL = '/db'

export async function fetchTeam(): Promise<TeamMemberCardProps[]> {
  const response = await fetch(`${BASE_URL}/team.json`)
  if (!response.ok) throw new Error('Failed to fetch team')
  return response.json()
}

export async function fetchTeamMemberById(id: string): Promise<TeamMemberCardProps | undefined> {
  const team = await fetchTeam()
  const foundMember = team.find((member) => member.id === id)

  if (!foundMember) {
    throw new Error(`Member с id "${id}" не найден`)
  }

  return foundMember
}
