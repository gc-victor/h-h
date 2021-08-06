export const filter = ({ completed, show, todos }) => {
    if (show() === 'all') return todos();

    return todos().filter(({ id }) => {
        const includes = completed().includes(id);
        return show() === 'active' ? !includes : includes;
    });
};
