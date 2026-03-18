import { Pagination } from "react-bootstrap";

function PagingBar({ page, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const createPageItems = () => {
        const items = [];
        const start = Math.max(0, page - 2);
        const end = Math.min(totalPages - 1, page + 2);

        for (let i = start; i <= end; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={() => onPageChange(i)}
                >
                    {i + 1}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <Pagination className="justify-content-center mt-4">
            <Pagination.First
                onClick={() => onPageChange(0)}
                disabled={page === 0}
            />
            <Pagination.Prev
                onClick={() => onPageChange(page - 1)}
                disabled={page === 0}
            />

            {createPageItems()}

            <Pagination.Next
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
            />
            <Pagination.Last
                onClick={() => onPageChange(totalPages - 1)}
                disabled={page >= totalPages - 1}
            />
        </Pagination>
    );
}

export default PagingBar;