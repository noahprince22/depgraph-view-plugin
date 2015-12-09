package hudson.plugins.depgraph_view.model.graph;

/**
 * Created by wortman2 on 11/4/15.
 */

import hudson.model.BallColor;
import hudson.model.FreeStyleBuild;
import hudson.model.FreeStyleProject;
import hudson.model.Result;
import hudson.tasks.Shell;
import org.junit.Rule;
import org.junit.Test;
import org.jvnet.hudson.test.FailureBuilder;
import org.jvnet.hudson.test.JenkinsRule;
import org.jvnet.hudson.test.UnstableBuilder;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import static hudson.plugins.depgraph_view.model.graph.ProjectNode.node;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ProjectNodeTest {
//    private AbstractProject<?, ?> project;
    private ProjectNode node1;
/*
    @Before
    node = new ProjectNode(project);
*/
    private FreeStyleProject project1;
    @Rule
    public JenkinsRule j = new JenkinsRule();
    // test for ProjectNode

    @Test
    public void getNameTest()  throws IOException {
      createProject();
      node1 = new ProjectNode(project1);
      assertEquals("test0", node1.getName());
    }

    @Test
    public void getColorTest1() throws Exception, InterruptedException, ExecutionException {
      createProject();
      project1.getBuildersList().add(new FailureBuilder());
      FreeStyleBuild r = project1.scheduleBuild2(0).get();
      j.assertBuildStatus(Result.FAILURE, r);
      node1 = node(project1);
      assertTrue(node1.getColor().equals(BallColor.RED.getHtmlBaseColor()));
    }

    @Test
    public void getColorTest2() throws Exception, InterruptedException, ExecutionException {
      createProject();
      project1.getBuildersList().add(new UnstableBuilder());
      FreeStyleBuild r = project1.scheduleBuild2(0).get();
      j.assertBuildStatus(Result.UNSTABLE, r);
      node1 = node(project1);
      assertTrue(node1.getColor().equals(BallColor.YELLOW.getHtmlBaseColor()));
    }

    @Test
    public void getColorStatus1() throws Exception, InterruptedException, ExecutionException {
      createProject();
      project1.getBuildersList().add(new FailureBuilder());
      FreeStyleBuild r = project1.scheduleBuild2(0).get();
      j.assertBuildStatus(Result.FAILURE, r);
      node1 = node(project1);
      assertTrue(BallColor.RED.getDescription().equals(node1.getStatus()));
    }

    public void getColorStatus2() throws Exception {
      createProject();
      node1 = node(project1);
      assertTrue(BallColor.NOTBUILT.getDescription().equals(node1.getStatus()));
    }

    @Test
    public void getColorStatus3() throws Exception , InterruptedException, ExecutionException {
      createProject();
      project1.getBuildersList().add(new UnstableBuilder());
      FreeStyleBuild r = project1.scheduleBuild2(0).get();
      j.assertBuildStatus(Result.UNSTABLE, r);
      node1 = node(project1);
      assertTrue(BallColor.YELLOW.getDescription().equals(node1.getStatus()));
    }

    @Test
    public void getAvgDurationTest()throws Exception {
      createProject();
      for(int i=0;i<1000;i++){
          project1.getBuildersList().add(new Shell("echo hello"));
      }
      long starttime = System.currentTimeMillis();
      FreeStyleBuild build = project1.scheduleBuild2(0).get();
      long endtime = System.currentTimeMillis();
      node1 = node(project1);
      String s = node1.getAvgDuration();
      double avgT = Double.parseDouble(s.substring(0,s.length()-2));
      double t = (double)(endtime-starttime)/1000;

      assertTrue(Math.abs(t-avgT)<0.1);
    }
    private void createProject() throws IOException {
        project1 = j.createFreeStyleProject();
    }

}
