/*
 * Copyright (c) 2012 Stefan Wolf
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package hudson.plugins.depgraph_view.model.graph;

import com.google.common.base.Preconditions;
import hudson.model.AbstractProject;
import hudson.model.Run;
import hudson.model.Job;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
/**
 * A Node in the DependencyGraph, which corresponds to a Project
 */
public class ProjectNode {
    private final AbstractProject<?,?> project;

    public static ProjectNode node(AbstractProject<?, ?> project) {
        return new ProjectNode(project);
    }

    public ProjectNode(AbstractProject<?, ?> project) {
        Preconditions.checkNotNull(project);
        this.project = project;
    }

    public String getName() {
        return project.getFullDisplayName();
    }

    public String getColor() {
      return project.getIconColor().getHtmlBaseColor();
    }

    public String getMetadata(){
      String meta = "status: " + getStatus() + "<br>";
      meta = meta + "lastBuild: " + getLastBuildDate() + "<br>";
      meta = meta + "averageDuration: " + getAvgDuration();
      return meta;
    }

    public String getStatus() {
      return project.getIconColor().getDescription();
    }

    public String getAvgDuration(){
      int cnt = 0;
      int sum = 0;
      List<Run> builds = getBuilds();
      for(int i=builds.size()-1;i>=0&&cnt<builds.size();i--){
        sum += (builds.get(i)!=null) ? builds.get(i).getDuration() : 0;
        if(builds.get(i)!=null)cnt++;
      }
      double avg = (cnt > 0) ? ((double)sum/(cnt*1000)) : 0;
      return Double.toString(avg) + "s";
    }

    public String getLastBuildDate(){
      Run build = project.getLastBuild();
      return (build!=null) ? build.getTimestamp().getTime().toString() : "not built";
    }

    // public String getWorkspace(){
    //   return (project.getWorkspace()!=null) ? project.getWorkspace().toString() : "unknown";
    // }


    public AbstractProject<?, ?> getProject() {
        return project;
    }

    public List<Run> getBuilds(){
      List<Run> lastBuilds = new ArrayList<Run>();
      for (Job item : project.getAllJobs()) {
          Job job = (Job) item;
          Run lb = job.getLastBuild();
          while (lb != null && (lb.hasntStartedYet() || lb.isBuilding()))lb = lb.getPreviousBuild();
          lastBuilds.add(lb);
      }
      return lastBuilds;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ProjectNode that = (ProjectNode) o;

        if (!project.equals(that.project)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return project.hashCode();
    }
}
