export function mapformat(old_format){
   var new_format = {}
   new_format.image = "https://gateway.pinata.cloud/ipfs/"+ old_format.image;
   new_format.name = old_format.name;
   new_format.description = old_format.description;
   new_format.attributes= [
    {
      trait_type: "confidence",
      value: "",
    },
    {
      trait_type: "energy_level",
      value: "",
    },
    {
      trait_type: "personality",
      value: "",
    },
    {
      trait_type: "behavior",
      value: "",
    },
    {
      trait_type: "intelligence",
      value: "",
    },
    {
      trait_type: "popularity",
      value: "",
    },
  ];
  for(let i =0;i<new_format.attributes.length;i++){
    new_format.attributes[i].value=old_format[new_format.attributes[i].trait_type]
  }
  let res={
    "pinataMetadata": {
        name:old_format.name
    },
    "pinataContent":new_format
    
  }
  return res;

    


}
