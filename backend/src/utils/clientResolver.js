// backend/src/utils/clientResolver.js (CREATE NEW FILE)

import supabase from "./supabaseClient.js";

/**
 * Get dentist's GHL ID from Supabase UUID
 * @param {string} supabaseUserId - UUID from auth token
 * @returns {Promise<string>} GHL ID
 */
export async function getGHLId(supabaseUserId) {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('external_id')
    .eq('id', supabaseUserId)
    .single();

  if (error) {
    throw new Error(`Failed to get GHL ID: ${error.message}`);
  }

  if (!data?.external_id) {
    throw new Error('Dentist not linked to GHL. Please contact support.');
  }

  return data.external_id;
}

/**
 * Get both IDs for a dentist
 * @param {string} supabaseUserId - UUID from auth token
 * @returns {Promise<{supabaseId: string, ghlId: string}>}
 */
export async function getDentistIds(supabaseUserId) {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('id, external_id')
    .eq('id', supabaseUserId)
    .single();

  if (error) {
    throw new Error(`Failed to get dentist: ${error.message}`);
  }

  return {
    supabaseId: data.id,
    ghlId: data.external_id
  };
}