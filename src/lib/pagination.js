 export default function  getThreePages (currentPage, total_pages){
  let pages = [];

  // If only 1 page
  if (total_pages <= 1) return [1];

  // If only 2 pages
  if (total_pages === 2) return [1, 2];

  // For 3 or more pages:
  // Always show 3 pages centered around currentPage

  if (currentPage === 1) {
    pages = [1, 2, 3];
  } else if (currentPage === total_pages) {
    pages = [total_pages - 2, total_pages - 1, total_pages];
  } else {
    pages = [currentPage - 1, currentPage, currentPage + 1];
  }

  // Prevent going below 1
  pages = pages.map((p) => (p < 1 ? 1 : p));

  // Prevent going above total_pages
  pages = pages.map((p) => (p > total_pages ? total_pages : p));

  return [...new Set(pages)];
};