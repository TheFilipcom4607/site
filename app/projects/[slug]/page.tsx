import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";

export const revalidate = 60;

type Props = {
	params: {
		slug: string;
	};
};

const redis = Redis.fromEnv();

export async function generateStaticParams(): Promise<Props["params"][]> {
	return allProjects
		.filter((p) => p.published)
		.map((p) => ({
			slug: p.slug,
		}));
}

export default async function PostPage({ params }: Props) {
	const slug = params?.slug;

	if (!slug) {
		console.error("Missing slug in params:", params);
		notFound();
	}

	// Find the project by slug
	const project = allProjects.find((project) => project.slug === slug);

	if (!project) {
		console.error(`Project not found for slug: ${slug}`);
		notFound();
	}

	// Fetch views from Redis with error handling
	let views = 0;
	try {
		views = (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0;
	} catch (error) {
		console.error("Error fetching views from Redis:", error);
	}

	return (
		<div className="bg-zinc-50 min-h-screen">
			<Header project={project} views={views} />
			<ReportView slug={project.slug} />

			<article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
				<Mdx code={project.body.code} />
			</article>
		</div>
	);
}
