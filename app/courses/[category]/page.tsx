export default function CategoryPage({
	params,
}: {
	params: { category: string }
}) {
	return (
		<main>
			<h1>Category: {params.category}</h1>
		</main>
	)
}
