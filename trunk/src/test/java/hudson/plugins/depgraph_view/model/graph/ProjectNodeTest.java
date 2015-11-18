package hudson.plugins.depgraph_view.model.graph;

/**
 * Created by wortman2 on 11/4/15.
 */

import static org.junit.Assert.*;

import hudson.model.AbstractProject;
import hudson.model.FreeStyleProject;
import org.apache.tools.ant.Project;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.jvnet.hudson.test.JenkinsRule;

import java.io.IOException;

public class ProjectNodeTest {
    private FreeStyleProject project;
    private ProjectNode node;

    @Rule
    public JenkinsRule j = new JenkinsRule();

    @Test
    public void testTest() {
        assertTrue(true);
    }

    @Test
    public void getColorUnbuiltTest() throws IOException {
        createProjectAndNode();

        assertEquals(node.getColor(), "notbuilt");
    }

    public void createProjectAndNode() throws IOException {
        project = j.createFreeStyleProject();
        node = new ProjectNode(project);
    }
}
