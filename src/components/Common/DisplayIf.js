const DisplayIf = ({ condition, children }) => {
    return condition ? children : null;
}

export default DisplayIf;