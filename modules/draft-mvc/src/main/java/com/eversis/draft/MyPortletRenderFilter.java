package com.eversis.draft;

import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.StringBundler;
import com.liferay.portal.kernel.util.WebKeys;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import java.io.IOException;
import java.util.Objects;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.portlet.filter.FilterChain;
import javax.portlet.filter.FilterConfig;
import javax.portlet.filter.PortletFilter;
import javax.portlet.filter.RenderFilter;
import javax.portlet.filter.RenderResponseWrapper;
import javax.servlet.ServletContext;

@Component(immediate = true, property = {
        "javax.portlet.name=com_liferay_journal_web_portlet_JournalPortlet"}, service = PortletFilter.class)
public class MyPortletRenderFilter implements RenderFilter {

    @Override
    public void init(FilterConfig filterConfig) throws PortletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(RenderRequest request, RenderResponse response, FilterChain chain)
            throws IOException, PortletException {

        String mvcPath = request.getParameter("mvcPath");

        if (Objects.equals(mvcPath, "/edit_article.jsp")) {

            String articleId = request.getParameter("articleId");
            String groupId = request.getParameter("groupId");
            String versionId = request.getParameter("version");

            if (!Objects.isNull(articleId) && !Objects.isNull(versionId) && !Objects.isNull(groupId)) {

                long longGroupId = Long.parseLong(groupId);
                double doubleVersion = Double.parseDouble(versionId);

                JournalArticle journalArticle = null;
                try {
                    journalArticle = _journalArticleService.getArticle(longGroupId, articleId, doubleVersion);
                } catch (PortalException e) {
                    e.printStackTrace();
                }

                if (Objects.requireNonNull(journalArticle).getStatus() == 2) {

                    RenderResponseWrapper renderResponseWrapper = new BufferedRenderResponseWrapper(response);
                    chain.doFilter(request, renderResponseWrapper);

                    String text = renderResponseWrapper.toString();
                    ThemeDisplay themeDisplay = (ThemeDisplay)request.getAttribute(WebKeys.THEME_DISPLAY);

                    if (!Objects.isNull(text)) {

                        StringBundler sb1 = new StringBundler(4);
                        sb1.append("<script src=\"" + themeDisplay.getPortalURL() + PortalUtil.getPathProxy() + _servletContext.getContextPath());
                        sb1.append("/js/plugin.js");
                        sb1.append("\" ");
                        sb1.append("type=\"text/javascript\"></script>");

                        response.getWriter().write(text + sb1.toString());
                    }
                } else {
                    chain.doFilter(request, response);
                }
            } else {
                chain.doFilter(request, response);
            }
        } else {
            chain.doFilter(request, response);
        }
    }

    private JournalArticleService _journalArticleService;

    @Reference(unbind = "-")
    protected void setGroupLocalService1(JournalArticleService journalArticleService) {
        _journalArticleService = journalArticleService;
    }

    @Reference(
            target = "(osgi.web.symbolicname=com.eversis.draft)",
            unbind = "-"
    )
    protected void setServletContext(ServletContext servletContext) {
        _servletContext = servletContext;
    }

    private ServletContext _servletContext;
}