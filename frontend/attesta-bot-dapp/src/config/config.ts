export const SCHEMA_REGISTRY_ADDRESS =
  "0x9c3afcf92221b9a0f05fc97ad0a36db27c332596bd7ddc5832975c03a98ae28f";
export const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

export const SCHEMA =
  "string DAO_name,string event_name,string description,string usd_amount,string ticket_url,address attester_address";


export const enviromentId = process.env.DYNAMIC_ENV_ID
    if(!enviromentId){
      throw Error('Dynamic env ID not found')
    }