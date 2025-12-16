import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submissionService,
  ProjectSubmission,
  UpdateSubmissionPayload,
} from "@/services/submission/submission.service";

interface SubmissionEditModalProps {
  isOpen: boolean;
  submission: ProjectSubmission;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmissionEditModal({
  isOpen,
  submission,
  onClose,
  onSuccess,
}: SubmissionEditModalProps) {
  const [formData, setFormData] = useState({
    project_title: submission.project_title,
    project_desc: submission.project_desc,
    github_url: submission.github_url,
    live_url: submission.live_url || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.project_title.trim() ||
        !formData.project_desc.trim() ||
        !formData.github_url.trim()
      ) {
        setError("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate URLs
      try {
        new URL(formData.github_url);
        if (formData.live_url && formData.live_url.trim()) {
          new URL(formData.live_url);
        }
      } catch {
        setError("Please enter valid URLs");
        setIsSubmitting(false);
        return;
      }

      const payload: UpdateSubmissionPayload = {
        project_title: formData.project_title,
        project_desc: formData.project_desc,
        github_url: formData.github_url,
        live_url: formData.live_url || undefined,
      };

      await submissionService.update(submission.id, payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_title">Project Title *</Label>
            <Input
              id="project_title"
              name="project_title"
              placeholder="e.g., AI Chat Assistant"
              value={formData.project_title}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_desc">Project Description *</Label>
            <Textarea
              id="project_desc"
              name="project_desc"
              placeholder="Describe your project, features, and tech stack"
              value={formData.project_desc}
              onChange={handleChange}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL *</Label>
            <Input
              id="github_url"
              name="github_url"
              type="url"
              placeholder="https://github.com/username/repo"
              value={formData.github_url}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="live_url">Live Demo URL (Optional)</Label>
            <Input
              id="live_url"
              name="live_url"
              type="url"
              placeholder="https://your-app.com"
              value={formData.live_url}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
