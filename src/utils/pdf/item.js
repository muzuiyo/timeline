export function generateTimelineItemToHtml(item) {
  // console.log(item)
  const itemHeader = `
		<div class="pdftimeline-item">
        <div class="pdftimeline-item-meta-date">
            ${item.createdTime}
        </div>
	`;
  const itemFooter = `
	  <div class="pdftimeline-item-meta-more">
            <div class="pdftimeline-item-meta-activity">
                <div class="pdftimeline-item-username">
                    @${item.username}
                </div>
                <div class="pdftimeline-item-class">
                    ${item.type}
                </div>
            </div>
            <div class="pdftimeline-item-meta-order">
               id:${item.id}
            </div>
        </div>
    </div>
	`;
	const subjectHtml = item.subject ? `
		<div class="pdftimeline-item-main-subject">
			<div class="pdftimeline-item-subject-cover-container">
				<img class="pdftimeline-item-subject-cover" src="https://proxy.lain.today/${item.subject.images.medium} " />
			</div>
			<div class="pdftimeline-item-main-subject-info">
				<p class="pdftimeline-item-main-subject-info-name">
					${item.subject.name}
				</p>
				<p class="pdftimeline-item-main-subject-info-more">
					${item.subject.info}
				</p>
			</div>
		</div>
	` : "";
	const socialHtml = item.social ? `
		<div class="pdftimeline-item-main-columnB">
      <img class="social-avatar" src="https://proxy.lain.today/${item.social.images.medium}" />
    </div>
	` : `
		<div class="pdftimeline-item-main-columnB" style="width: 0px !important">
    </div>
	`;
	const commentHtml = item.comment ? `
		<div class="pdftimeline-item-main-comment">
      ${item.comment}
    </div>
	` : "";
  const itemBody = `
		<div class="pdftimeline-item-main">
      <div class="pdftimeline-item-main-columnA">
        <div class="pdftimeline-item-main-status">
          ${item.status}
        </div>
        ${commentHtml}
        ${subjectHtml}
      </div>
			${socialHtml}
    </div>
    `;
	const itemHtml = itemHeader + itemBody + itemFooter;
  return itemHtml;
}
