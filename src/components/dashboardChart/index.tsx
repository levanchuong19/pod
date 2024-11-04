/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import CardComponent from "../dashboardCard";
import AreaChart from "../areaChart";
import BarChart from "../barChart";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import api from "../config/api";
import { Table } from "antd";
import moment from "moment";

const DashboardChard: React.FC = () => {
  const navigate = useNavigate();
  const [isData, setIsData] = useState<any>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [top5Pods, setTop5Pods] = useState<any[]>([]);
  const [selectedDate] = useState<moment.Moment | null>(moment());
  const [isLocation, setisLocation] = useState<any>(null);
  const [isPod, setIsPod] = useState<any>(null);
  const [isService, setIsService] = useState<any>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const scrollToService = () => {
    serviceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const fetchData = async () => {
    try {
      const response = await api.get("dashboard/revenue-stats");
      setIsData(response.data);
      const location = await api.get("dashboard/revenue-by-location");
      setisLocation(location.data.data);
      console.log(location.data.data);
      const pod = await api.get("dashboard/revenue-by-pod");
      setIsPod(pod.data.data);
      console.log(pod.data.data);
      const service = await api.get("dashboard/top-used-services");
      setIsService(service.data.data);
      console.log(service.data.data);
      const top5Pods = response.data.bestSellingPods
        .sort(
          (a: { totalBookings: number }, b: { totalBookings: number }) =>
            b.totalBookings - a.totalBookings
        )
        .slice(0, 5);
      setTop5Pods(top5Pods);
      const yearlyRevenue: any = [];
      for (let month = 1; month <= 12; month++) {
        const monthlyRevenueResponse = await api.get(
          `dashboard/revenue/monthly?month=${month}&year=${selectedDate?.year()}`
        );
        yearlyRevenue.push(monthlyRevenueResponse.data.revenue);
      }
      setMonthlyRevenue(yearlyRevenue);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isData) {
    return <div>Loading...</div>;
  }

  const totalLocations = isData.locationCount;
  const totalPods = isData.podCount;
  const totalServices = isData.deviceCount;
  const totalDevices = isData.deviceCount;
  const areaChartLabels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const areaChartData = monthlyRevenue;
  const barChartLabels = isData.bestSellingPods.map(
    (pod: { podName: any }) => pod.podName
  );
  const barChartData = isData.bestSellingPods.map(
    (pod: { totalBookings: any }) => pod.totalBookings
  );

  const barChartLabelsLocation = isLocation?.map(
    (item: { locationName: any }) => item.locationName
  );
  const barChartDataLoaction = isLocation?.map(
    (item: { revenue: any }) => item.revenue
  );
  const barChartLabelsPOD = isPod?.map(
    (item: { podName: any }) => item.podName
  );
  const barChartDataPOD = isPod?.map((item: { revenue: any }) => item.revenue);
  const barChartLabelsService = isService?.map(
    (item: { serviceName: any }) => item.serviceName
  );
  const barChartDataService = isService?.map(
    (item: { usageCount: any }) => item.usageCount
  );
  const podColumns = [
    {
      title: "Pod Name",
      dataIndex: "podName",
      key: "podName",
    },
    {
      title: "Total Bookings",
      dataIndex: "totalBookings",
      key: "totalBookings",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => `${revenue.toLocaleString()} VND`,
    },
  ];

  return (
    <div className="dashboard-container">
      <div>
        <div className="card-container">
          <CardComponent
            title={`Location (${totalLocations})`}
            color="#3f51b5"
            onClick={() =>
              //  navigate("/dashboard/revenueLocation")
              scrollToTable()
            }
          />
          <CardComponent
            title={`POD (${totalPods})`}
            color="#ff9800"
            onClick={() =>
              // navigate("/dashboard/pods")
              scrollToTable()
            }
          />
          <CardComponent
            title={`Service (${totalServices})`}
            color="#4caf50"
            onClick={() =>
              // navigate("/dashboard/services")
              scrollToService()
            }
          />
          <CardComponent
            title={`Device (${totalDevices})`}
            color="#f44336"
            onClick={() => navigate("/dashboard/devices")}
          />
        </div>

        <div className="chart-container">
          <div className="chart">
            <div className="chart-title">Doanh thu</div>
            <AreaChart labels={areaChartLabels} data={areaChartData} />
          </div>
          <div className="chart">
            <div className="chart-title">Best Seller</div>
            <BarChart labels={barChartLabels} data={barChartData} />
          </div>
        </div>
        <div className="table-container">
          <h2>Top 5 POD được sử dụng nhiều nhất</h2>
          <Table dataSource={top5Pods} columns={podColumns} rowKey="podId" />
        </div>
      </div>

      <div>
        <div ref={tableRef} className="chart-container">
          <div className="chart">
            <div className="chart-title">Doanh thu theo từng địa điểm</div>
            <BarChart
              labels={barChartLabelsLocation}
              data={barChartDataLoaction}
            />
          </div>
          <div className="chart">
            <div className="chart-title">Doanh thu theo từng POD</div>
            <BarChart labels={barChartLabelsPOD} data={barChartDataPOD} />
          </div>
        </div>

        <div
          ref={serviceRef}
          style={{ marginTop: "100px", width: "600px", marginLeft: "270px" }}
          className="chart"
        >
          <div className="chart-title">Dịch vụ được sử dụng</div>
          <BarChart labels={barChartLabelsService} data={barChartDataService} />
        </div>
      </div>
    </div>
  );
};

export default DashboardChard;
