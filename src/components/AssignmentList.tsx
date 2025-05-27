import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { formatDate, getDueDateColor, truncateText } from '../lib/utils';
import { Calendar, ExternalLink, BookOpen, CheckSquare, Square, Eye, EyeOff, Filter } from 'lucide-react';

export const AssignmentList: React.FC = () => {
  const { 
    toggleAssignmentSelection, 
    selectAllAssignments, 
    deselectAllAssignments,
    getSelectedAssignments,
    getVisibleAssignments,
    getHiddenAssignments,
    showHiddenAssignments,
    setShowHiddenAssignments,
    toggleAssignmentVisibility
  } = useAssignmentStore();

  const visibleAssignments = getVisibleAssignments();
  const hiddenAssignments = getHiddenAssignments();
  const selectedCount = getSelectedAssignments().length;
  const allSelected = visibleAssignments.length > 0 && selectedCount === visibleAssignments.length;
  const someSelected = selectedCount > 0 && selectedCount < visibleAssignments.length;

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAllAssignments();
    } else {
      selectAllAssignments();
    }
  };

  if (visibleAssignments.length === 0 && hiddenAssignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No assignments found</h3>
        <p className="text-muted-foreground">
          No current assignments were found in your Canvas courses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center space-x-2"
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : someSelected ? (
              <Square className="h-4 w-4 opacity-50" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            <span>
              {allSelected ? 'Deselect All' : 'Select All'}
            </span>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedCount} of {visibleAssignments.length} selected
        </div>
      </div>

      {/* Hidden assignments toggle */}
      {hiddenAssignments.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              {hiddenAssignments.length} assignment{hiddenAssignments.length !== 1 ? 's' : ''} auto-hidden 
              (detected as "due in class")
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHiddenAssignments(!showHiddenAssignments)}
            className="flex items-center space-x-2 text-orange-700 hover:text-orange-900"
          >
            {showHiddenAssignments ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Show</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Assignment list */}
      <div className="space-y-3">
        {visibleAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className={`p-4 rounded-lg border transition-colors ${
              assignment.isSelected 
                ? 'bg-primary/5 border-primary/20' 
                : assignment.isDueInClass
                ? 'bg-orange-50 border-orange-200'
                : 'bg-card border-border hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={assignment.isSelected}
                onCheckedChange={() => toggleAssignmentSelection(assignment.id)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm leading-tight">
                        {truncateText(assignment.name, 60)}
                      </h3>
                      {assignment.isDueInClass && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                          Due in class
                        </span>
                      )}
                    </div>
                    {assignment.courseName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {assignment.courseName}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => toggleAssignmentVisibility(assignment.id)}
                      title={assignment.isHidden ? "Show assignment" : "Hide assignment"}
                    >
                      {assignment.isHidden ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => window.open(assignment.html_url, '_blank')}
                      title="Open in Canvas"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                  <div className={`flex items-center space-x-1 ${getDueDateColor(assignment.due_at)}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(assignment.due_at)}</span>
                  </div>
                  
                  {assignment.points_possible && (
                    <div className="text-muted-foreground">
                      {assignment.points_possible} pts
                    </div>
                  )}
                </div>

                {assignment.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {truncateText(assignment.description.replace(/<[^>]*>/g, ''), 100)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected assignments summary */}
      {selectedCount > 0 && (
        <div className="sticky bottom-4 p-4 bg-primary text-primary-foreground rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {selectedCount} assignment{selectedCount !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs opacity-90">
                Ready to send to AI solver
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Process Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
