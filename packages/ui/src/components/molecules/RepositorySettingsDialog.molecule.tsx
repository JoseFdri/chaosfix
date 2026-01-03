import { Dialog, DialogContent, DialogHeader, DialogTitle, type DialogProps } from "../atoms";
import { cn } from "../../libs/cn.lib";

export interface RepositorySettingsDialogProps extends Omit<DialogProps, "children"> {
  repositoryName: string;
  className?: string;
}

export const RepositorySettingsDialog = ({
  repositoryName,
  className,
  open,
  onOpenChange,
  ...props
}: RepositorySettingsDialogProps): React.JSX.Element => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className={cn(className)} showCloseButton>
        <DialogHeader>
          <DialogTitle>{repositoryName} Settings</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-sm text-text-secondary">Settings content coming soon</div>
      </DialogContent>
    </Dialog>
  );
};

RepositorySettingsDialog.displayName = "RepositorySettingsDialog";
