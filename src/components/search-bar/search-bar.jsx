import Form from "react-bootstrap/Form";

export const SearchBar = ({ onSearchTermChange, searchInput }) => {
  const handleInputChange = (e) => {
    onSearchTermChange(e.target.value);
  };

  return (
    <Form>
      <Form.Control
        type="search"
        placeholder="Search"
        size="sm"
        onChange={handleInputChange}
        aria-label="Search"
      />
    </Form>
  );
};