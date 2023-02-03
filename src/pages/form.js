export default function Document() {
  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", document.getElementById('image').files[0]);
    formData.append("name", document.getElementById('name').value);
    formData.append("desc", document.getElementById('desc').value);
    await fetch('/api/nft_storage', {
      method: 'post',
      body: formData
    })
  };
  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", flexDirection: "column", width: "30%" }}
      encType="multipart/form-data"
    >
      <label htmlFor="name">Name</label>
      <input id="name"></input>
      <label htmlFor="desc" > Desc</label >
      <input id="desc"></input>
      <label htmlFor="image" > Image</label >
      <input id="image" type="file"></input>
      <input type="submit"></input>
    </form >
  );
}
