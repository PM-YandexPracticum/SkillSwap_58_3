import { TeamMemberCardProps } from '@/widgets/TeamMemberCard'
const BASE_URL = '/db'

export async function fetchTeam(): Promise<TeamMemberCardProps[]> {
  const response = await fetch(`${BASE_URL}/team.json`)
  if (!response.ok) throw new Error('Failed to fetch cities')
  return response.json()
}
