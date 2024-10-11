"use server";

/**
 * 
 * @param enumName
 * @returns
 */

export async function getEnumValues(enumName: string) {
  const supabase: any = () => {};

  const { data, error } = await supabase.rpc("get_enum_values", {
    enum_name: enumName,
  });

  if (error) {
    return [];
  }

  return data.map((item: any) => item.enum_value);
}
