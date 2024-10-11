"use server";

/**
 *
 * @param team_id
 * @returns
 */

export async function memberBelongsToTeam(team_id: string) {
  // Processing
  const supabase: any = () => {};

  const { data } = await supabase.rpc("member_belongs_to_team", {
    p_team_id: team_id,
  });

  return data;
}
