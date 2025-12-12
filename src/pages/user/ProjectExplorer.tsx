import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Bookmark } from "lucide-react";

export default function ProjectExplorer() {
  const [githubProjects, setGithubProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("react project");
  const [filter, setFilter] = useState("");

  // -------- GitHub API Fetch ----------
  const fetchGithubProjects = async (searchQuery: string) => {
    try {
      const tagQuery = filter ? `${searchQuery}+topic:${filter}` : searchQuery;

      const res = await fetch(
        `https://api.github.com/search/repositories?q=${tagQuery}&per_page=20`
      );

      const data = await res.json();
      setGithubProjects(data.items || []);
    } catch (e) {
      console.error("GitHub fetch error:", e);
      setGithubProjects([]);
    }
  };

  // -------- Dev.to API Fetch (run only once) ----------
  const fetchDevtoBlogs = async () => {
    try {
      const res = await fetch(
        "https://dev.to/api/articles?tag=project&per_page=20"
      );

      const data = await res.json();
      setBlogs(data);
    } catch (e) {
      console.error("Dev.to fetch error:", e);
      setBlogs([]);
    }
  };

  // Fetch Dev.to blogs only once
  useEffect(() => {
    fetchDevtoBlogs();
  }, []);

  // Debounced GitHub fetch on query/filter change
  useEffect(() => {
    setLoading(true);

    const delay = setTimeout(async () => {
      await fetchGithubProjects(query);
      setLoading(false);
    }, 400); // debounce search

    return () => clearTimeout(delay);
  }, [query, filter]);

  const tags = [
    "react",
    "python",
    "fastapi",
    "mern",
    "ai",
    "ml",
    "javascript",
    "fullstack",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Project Explorer</h1>
        <p className="text-muted-foreground">
          Explore real GitHub projects and developer-written blogs to learn and
          build better.
        </p>

        {/* Search + Filters Section */}
<Card className="border border-border bg-card p-5">
  <div className="space-y-4">
    {/* Label */}
    <h2 className="text-lg font-semibold text-foreground">Search Projects</h2>

    {/* Search Input */}
        <div className="flex items-center">
        <input
            type="text"
            placeholder="Search GitHub projects (e.g., fastapi authentication)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
                w-full
                p-3
                rounded-md
                bg-white                 /* white background */
                text-black               /* black text */
                placeholder:text-gray-500
                border border-border
                focus:ring-2 focus:ring-primary
                focus:outline-none
                text-sm
            "
            />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
        {tags.map((tag) => (
            <Badge
            key={tag}
            variant={filter === tag ? "default" : "outline"}
            className="
                cursor-pointer px-3 py-1 rounded-full 
                transition-colors text-sm
            "
            onClick={() => {
                const newFilter = tag === filter ? "" : tag;
                setFilter(newFilter);
                setQuery(newFilter ? `${newFilter} project` : query);
            }}
            >
            {tag}
            </Badge>
        ))}
        </div>
    </div>
    </Card>


        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

        {/* GitHub Projects */}
        <h2 className="text-xl font-bold mt-6">GitHub Projects</h2>

        {!loading && githubProjects.length === 0 && (
          <p className="text-muted-foreground">No projects found.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {githubProjects.map((project) => (
            <Card key={project.id} className="border border-border">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  ⭐ {project.stargazers_count} stars
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm">
                  {project.description || "No description available."}
                </p>

                {/* Topics */}
                <div className="flex gap-1 flex-wrap">
                  {project.topics?.slice(0, 5).map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(project.html_url, "_blank")}
                  >
                    <Github className="h-4 w-4 mr-2" /> Repo
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log("Save to backend later")}
                  >
                    <Bookmark className="h-4 w-4 mr-2" /> Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blogs */}
        <h2 className="text-xl font-bold mt-10">Project Blogs</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="border border-border">
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {blog.user.name}
                </p>
              </CardHeader>

              <CardContent>
                <p className="text-sm mb-2">
                  {blog.description || "Project blog..."}
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(blog.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> Read Blog
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
